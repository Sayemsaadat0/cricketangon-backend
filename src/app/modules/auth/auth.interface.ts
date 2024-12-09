export type ILoginUser = {
    email: string
    password: string
  }
  
  export type ILoginUserResponse = {
    isTwoAuthenticate?:boolean;
    email?:string;
    message?:string
    accessToken?: string
    refreshToken?: string
    needsPasswordChange?: boolean
  }
  
  export type IRefreshTokenResponse = {
    accessToken: string
  }
  
  export type IChangePassword = {
    oldPassword: string
    newPassword: string
  }
  export type IForgetPassword = {
    newPassword: string
  }
  
  export type IVerifyData = {
    email: string
    verificationCode: number
  }
  