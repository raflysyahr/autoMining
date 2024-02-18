export default function getArgs(arg) {
    return process.argv.slice(2)[process.argv.slice(2).indexOf(arg) + 1]
}