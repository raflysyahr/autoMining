export default function uclear(str){ return str.split('').filter((e)=> "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-_".split('').some((s)=> s === e) ).join('')  }