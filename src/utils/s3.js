import AWS from 'aws-sdk'
// onestor
// export const bucket = 'tenant:solutionhub'
// export const s3 = () => {
//   const config = {
//     accessKeyId: '8DRQNHYF2ZA6HI4DZQ99',
//     secretAccessKey: 'V7F4EWVlK9s6AMaMUO2yv4iEPCutdnQmA2zgcDUx',
//     endpoint: '170.0.0.136:8082',
//     region: 'default',
//     sslEnabled: false,
//     s3ForcePathStyle: true,
//     signatureVersion: 'v4'
//   }
//   AWS.config.update(config)
//   return new AWS.S3()
// }

/* aws*/
export const bucket = 'yzerost'

export const s3 = () => {
  const config = {
    accessKeyId: 'AKIAZPK7DKHQCZ7QT352',
    secretAccessKey: '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',
    region: 'ap-northeast-1'
  }
  AWS.config.update(config)
  // const bucketRegion = 'ap-northeast-1'
  // const IdentityPoolId = 'ap-northeast-1:43ee37c0-72d7-4d81-ad58-90b3e4762000'
  // AWS.config.update({
  //   region: bucketRegion,
  //   credentials: new AWS.CognitoIdentityCredentials({
  //     IdentityPoolId: IdentityPoolId
  //   })
  // })
  return new AWS.S3()
}

