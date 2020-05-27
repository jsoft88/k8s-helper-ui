export class YamlDocument {
    yamlEntries: YamlEntry[];
    indent: number;

    constructor(indent: number = 2) {
        this.indent = indent;
        this.yamlEntries = [];
    }

    buildDocument(): string {
        if (this.yamlEntries.length === 0) {
            return '';
        }

        const sb: string[] = [];
        for (const entry of this.yamlEntries) {
            sb.push(entry.stringRepr(this.indent));
        }

        return sb.join('\n');
    }

    addEntry(entry: YamlEntry): void {
        this.yamlEntries.push(entry);
    }
}

export class YamlEntry {
    key: string;
    value?: string;
    values?: YamlEntry[];
    isNested: boolean;

    constructor() {
        this.isNested = false;
    }

    private stringReprHelper(indent: number, entryInstance: YamlEntry, level: number) {
        if (!entryInstance.values && entryInstance.value) {
            return `${ ' '.repeat(indent * level) }${ entryInstance.key }: ${ entryInstance.value }`;
        } else {
            if (entryInstance.isNested) {
                return `${ ' '.repeat(indent * level) }${ entryInstance.key }:\n` +
                        `${this.stringReprHelper(indent, entryInstance.values[0], level + 1) }`;
            } else {
                let retVal = `${ ' '.repeat(indent * level) }${ entryInstance.key}:\n`;

                for (let i = 0; i < entryInstance.values.length; ++i) {
                    retVal += `${ ' '.repeat(indent * level) }${ i === 0 ? '- ' : ''}` +
                        `${ this.stringReprHelper(indent, entryInstance.values[i], i > 0 ? level + 1 : level) }\n`;
                }

                return retVal;
            }
        }
    }

    stringRepr(indent?: number): string {
        return this.stringReprHelper(indent, this, 0);
    }
}
