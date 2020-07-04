import * as crypto from 'crypto';

function sha256(str: string): string {
  const hash = crypto.createHash('sha256');
  hash.update(str);

  return hash.digest('hex');
}

export default sha256;
