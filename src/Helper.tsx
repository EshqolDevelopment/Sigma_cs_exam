


export const map: Record<string, string> = {
    'name': "Hello",
    'subject': "String",
    'level': "Easy",
    'description': "This is the description",
    'image': "",
    'outputType': "int",
}


export const args: Record<string, string> = { }


export const tests: Record<string, string> = { }


export const languages: string[] = []


export function title(inp: string) {
    let str = ''
    for (const s of inp.split(' ')) {
        str += s[0].toUpperCase() + s.slice(1).toLowerCase() + ' '
    }
    return str.slice(0, -1)
}


