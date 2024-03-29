import {
    fileURLToPath
} from 'url'
import path from 'path';
import os from 'os';

const config = {
    "platform":os.platform(),
    "slash": os.type().startsWith('Windows') ? '\\' : (os.type().startsWith('Linux') ? '/' : '/'),
    "os": os.type(),
    "loading": {
        "frames": {
            "default": {
                "interval": 80,
                "frame": [
                    "⠋",
                    "⠙",
                    "⠹",
                    "⠸",
                    "⠼",
                    "⠴",
                    "⠦",
                    "⠧",
                    "⠇",
                    "⠏"
                ]
            },
            "simpleDots": {
                "interval": 400,
                "frame": [
                    ".  ",
                    ".. ",
                    "...",
                    "   "
                ]
            },
            "material": {
                "interval": 17,
                "frame": [
                    "█▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁",
                    "██▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁",
                    "███▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁",
                    "████▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁",
                    "██████▁▁▁▁▁▁▁▁▁▁▁▁▁▁",
                    "██████▁▁▁▁▁▁▁▁▁▁▁▁▁▁",
                    "███████▁▁▁▁▁▁▁▁▁▁▁▁▁",
                    "████████▁▁▁▁▁▁▁▁▁▁▁▁",
                    "█████████▁▁▁▁▁▁▁▁▁▁▁",
                    "█████████▁▁▁▁▁▁▁▁▁▁▁",
                    "██████████▁▁▁▁▁▁▁▁▁▁",
                    "███████████▁▁▁▁▁▁▁▁▁",
                    "█████████████▁▁▁▁▁▁▁",
                    "██████████████▁▁▁▁▁▁",
                    "██████████████▁▁▁▁▁▁",
                    "▁██████████████▁▁▁▁▁",
                    "▁██████████████▁▁▁▁▁",
                    "▁██████████████▁▁▁▁▁",
                    "▁▁██████████████▁▁▁▁",
                    "▁▁▁██████████████▁▁▁",
                    "▁▁▁▁█████████████▁▁▁",
                    "▁▁▁▁██████████████▁▁",
                    "▁▁▁▁██████████████▁▁",
                    "▁▁▁▁▁██████████████▁",
                    "▁▁▁▁▁██████████████▁",
                    "▁▁▁▁▁██████████████▁",
                    "▁▁▁▁▁▁██████████████",
                    "▁▁▁▁▁▁██████████████",
                    "▁▁▁▁▁▁▁█████████████",
                    "▁▁▁▁▁▁▁█████████████",
                    "▁▁▁▁▁▁▁▁████████████",
                    "▁▁▁▁▁▁▁▁████████████",
                    "▁▁▁▁▁▁▁▁▁███████████",
                    "▁▁▁▁▁▁▁▁▁███████████",
                    "▁▁▁▁▁▁▁▁▁▁██████████",
                    "▁▁▁▁▁▁▁▁▁▁██████████",
                    "▁▁▁▁▁▁▁▁▁▁▁▁████████",
                    "▁▁▁▁▁▁▁▁▁▁▁▁▁███████",
                    "▁▁▁▁▁▁▁▁▁▁▁▁▁▁██████",
                    "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁█████",
                    "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁█████",
                    "█▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁████",
                    "██▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁███",
                    "██▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁███",
                    "███▁▁▁▁▁▁▁▁▁▁▁▁▁▁███",
                    "████▁▁▁▁▁▁▁▁▁▁▁▁▁▁██",
                    "█████▁▁▁▁▁▁▁▁▁▁▁▁▁▁█",
                    "█████▁▁▁▁▁▁▁▁▁▁▁▁▁▁█",
                    "██████▁▁▁▁▁▁▁▁▁▁▁▁▁█",
                    "████████▁▁▁▁▁▁▁▁▁▁▁▁",
                    "█████████▁▁▁▁▁▁▁▁▁▁▁",
                    "█████████▁▁▁▁▁▁▁▁▁▁▁",
                    "█████████▁▁▁▁▁▁▁▁▁▁▁",
                    "█████████▁▁▁▁▁▁▁▁▁▁▁",
                    "███████████▁▁▁▁▁▁▁▁▁",
                    "████████████▁▁▁▁▁▁▁▁",
                    "████████████▁▁▁▁▁▁▁▁",
                    "██████████████▁▁▁▁▁▁",
                    "██████████████▁▁▁▁▁▁",
                    "▁██████████████▁▁▁▁▁",
                    "▁██████████████▁▁▁▁▁",
                    "▁▁▁█████████████▁▁▁▁",
                    "▁▁▁▁▁████████████▁▁▁",
                    "▁▁▁▁▁████████████▁▁▁",
                    "▁▁▁▁▁▁███████████▁▁▁",
                    "▁▁▁▁▁▁▁▁█████████▁▁▁",
                    "▁▁▁▁▁▁▁▁█████████▁▁▁",
                    "▁▁▁▁▁▁▁▁▁█████████▁▁",
                    "▁▁▁▁▁▁▁▁▁█████████▁▁",
                    "▁▁▁▁▁▁▁▁▁▁█████████▁",
                    "▁▁▁▁▁▁▁▁▁▁▁████████▁",
                    "▁▁▁▁▁▁▁▁▁▁▁████████▁",
                    "▁▁▁▁▁▁▁▁▁▁▁▁███████▁",
                    "▁▁▁▁▁▁▁▁▁▁▁▁███████▁",
                    "▁▁▁▁▁▁▁▁▁▁▁▁▁███████",
                    "▁▁▁▁▁▁▁▁▁▁▁▁▁███████",
                    "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁█████",
                    "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁████",
                    "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁████",
                    "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁████",
                    "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁███",
                    "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁███",
                    "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁██",
                    "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁██",
                    "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁██",
                    "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁█",
                    "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁█",
                    "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁█",
                    "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁",
                    "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁",
                    "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁",
                    "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁"
                ]
            },
            "bouncingBar": {
                "interval": 80,
                "frame": [
                    "[    ]",
                    "[=   ]",
                    "[==  ]",
                    "[=== ]",
                    "[ ===]",
                    "[  ==]",
                    "[   =]",
                    "[    ]",
                    "[   =]",
                    "[  ==]",
                    "[ ===]",
                    "[====]",
                    "[=== ]",
                    "[==  ]",
                    "[=   ]"
                ]
            }
        }
    },
  rootDir: process.argv.slice(2)[ process.argv.slice(2).indexOf('-d') + 1 ] ? process.argv.slice(2)['-d']  : path.join(fileURLToPath(
        import.meta.url), '../')
}
export default config
