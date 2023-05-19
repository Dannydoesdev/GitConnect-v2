// import fs from 'fs';
// import util from 'util';
// import { Storage } from '@google-cloud/storage';
// const pipeline = util.promisify(require('stream').pipeline);

// export async function downloadFileStream(bucketName: any, srcFilename: any, destFilename: any) {
//   // Creates a client
//   const storage = new Storage();

//   // Get a reference to the file in the bucket
//   const file = storage.bucket(bucketName).file(srcFilename);

//   // Create a read stream from the file
//   const readStream = file.createReadStream();

//   // Create a write stream to the local file system
//   const writeStream = fs.createWriteStream(destFilename);

//   // Use the pipeline API to handle backpressure and errors
//   await pipeline(readStream, writeStream);

//   console.log(`Downloaded ${srcFilename} from ${bucketName} to ${destFilename}`);
// }


// // Usage:
// downloadFile('my-bucket', 'my-file.txt', './my-file.txt')
//   .catch(console.error);
