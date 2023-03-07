import { initializeApp } from "firebase/app"
import { getAuth, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink  } from 'firebase/auth'

/**
 * firebase 文档： https://firebase.google.com/docs/auth/web/email-link-auth?hl=zh-cn
 * Firebase console: https://console.firebase.google.com/project/zkme-55dda/overview?hl=zh-cn
 */
const firebaseConfig = {
  apiKey: "AIzaSyASC8jRl8n0Dz9n6AkjuLcdZJw5LbgMINw",
  authDomain: "zkme-55dda.firebaseapp.com",
  projectId: "zkme-55dda",
  storageBucket: "zkme-55dda.appspot.com",
  messagingSenderId: "698552516939",
  appId: "1:698552516939:web:733ad87f97952314bfe8ce",
  measurementId: "G-KLLY2EL7WJ"
}

initializeApp(firebaseConfig)
const auth = getAuth()

/**
 * 发送校验邮件
 * @param email 接收邮件的邮箱地址
 */
export async function sendEmail (email: string) {
  const actionCodeSettings = {
    url: window.location.origin + import.meta.env.BASE_URL + '/check-inbox',
    handleCodeInApp: true,
    // iOS: {
    //   bundleId: 'com.zkme.app'
    // },
    // android: {
    //   packageName: 'com.zkme.app',
    //   installApp: true,
    //   minimumVersion: '12'
    // },
    dynamicLinkDomain: 'zkme.page.link'
  }

  const rp = await sendSignInLinkToEmail(auth, email, actionCodeSettings)
    .then((result) => {
      console.log('result', result)
      window.localStorage.setItem('emailForSignIn', email)
      return { valid: true, message: '' }
    })
    .catch((error) => {
      console.log('error', error)
      return { valid: false, message: error.message }
    })
  return rp
}


/**
 * 校验邮箱，成功之后并登录
 */
export async function verifyAndLogin () {
  if (isSignInWithEmailLink(auth, window.location.href)) {
    const email = window.localStorage.getItem('emailForSignIn') || ''
    if (!email) {
      // email = window.prompt('Please provide your email for confirmation');
      return
    }
    const rp = await signInWithEmailLink(auth, email, window.location.href).then((result) => {
      console.log('result', result)
      // window.localStorage.removeItem('emailForSignIn')
      return true
    }).catch((error) => {
      console.log('error', error)
      return false
    })
    return rp
  } else {
    return false
  }
}
