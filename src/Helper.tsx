


export const map: Record<string, string> = {
    'name': "Hello",
    'subject': "String",
    'level': "Easy",
    'time': "800",
    'description': "...",
    'image': "",
    'inputs': "",
    'outputs': "",
    'solution': "",
    'outputType': "",
}


export const args: Record<string, string> = { }


export const languages: string[] = []


export function title(inp: string) {
    let str = ''
    for (const s of inp.split(' ')) {
        str += s[0].toUpperCase() + s.slice(1).toLowerCase() + ' '
    }
    return str.slice(0, -1)
}