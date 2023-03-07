// import { groth16 } from 'snarkjs'
import type { InputData, Question, IssuerClaim, UserId, QuestionHashKey, Proof } from '@/types'
import { loadJs } from './common'

export class ZeroKnowledgeProof {
  #queryIssuerClaimWithKey (issuerClaimSet: IssuerClaim[], key: QuestionHashKey): IssuerClaim | undefined {
    return issuerClaimSet.find(c => c.claimSchema === key)
  }

  static async init (): Promise<boolean> {
    return loadJs('/lib/snarkjs.min.js')
  }

  /**
   * 给数组补足或限制在 64 个长度
   */
  splitQuestionContent (content: string | Array<string>): string[] {
    const arr = []
    const quota = 64

    if (typeof content === 'string') {
      arr.push(...content.split(','))
    } else {
      arr.push(...content)
    }

    if (arr.length < quota) {
      arr.push(...new Array(quota - arr.length).fill('0'))
    }
    if (arr.length > quota) {
      arr.splice(quota)
    }

    return arr
  }

  questionToInput (question: Question, issuerClaim: IssuerClaim, userID: UserId): InputData {
    // 有效期一年
    const expiry = (Date.now() + 365 * 86400000).toString().substring(0, 10)

    return {
      issuerClaim: [
        userID,
        question.hashKey,
        // 颁发的证明文件的有效期
        expiry,
        issuerClaim.content
      ],
      userID: userID,
      claimSchema: question.hashKey,
      operator: question.circuitOperator,
        // 用户开始验证的当前时间
      timestamp: Date.now().toString().substring(0, 10),
      value: this.splitQuestionContent(question.content)
    }
  }

  async generateProof (input: InputData): Promise<Proof | undefined> {
    try {
      const { proof, publicSignals } = await snarkjs.groth16.fullProve<InputData>(input, 'zkey/zkMeCredentialQuery.wasm', 'zkey/zkMeCredentialQuery_final.zkey')

      return { proof, pub_signals: publicSignals }
    } catch (error) {
      console.log(error)
    }
  }

  async generateProofs (issuerClaimSet: IssuerClaim[], questionSet: Question[], userID: UserId): Promise<Proof[]> {
    const genTasks: Promise<Proof | undefined>[] = []

    questionSet.forEach(q => {
      const c = this.#queryIssuerClaimWithKey(issuerClaimSet, q.hashKey)
      if (q.content && !isNaN(Number(q.content)) && c) {
        const input = this.questionToInput(q, c, userID)
        // console.log(input)
        genTasks.push(this.generateProof(input))
      }
    })

    const proofs = await Promise.all(genTasks)

    return proofs.filter(p => p) as Proof[]
  }
}
