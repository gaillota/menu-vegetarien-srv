import crypto from 'crypto';

const hash = crypto.createHash('sha256');

function sha256(str: string): string {
  hash.update(str);

  return hash.digest('hex');
}

export default sha256
