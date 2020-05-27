/**
 * Class representing a full yaml document, that is, it is composed of multiple Yaml entries.
 */
export class YamlDocument {
    yamlEntries: YamlEntry[];
    indent: number;

    /**
     * Constructor expects the number of spaces to use for indentation.
     * Default is 2.
     */
    constructor(indent: number = 2) {
        this.indent = indent;
        this.yamlEntries = [];
    }

    /**
     * This method builds the yaml document and for that simply calls repeatedly
     * ```stringRepr``` method of YamlEntry, and concatenates all string representations
     * by new line character.
     */
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

    /**
     * Method to append a new entry to the document.
     * @param entry the YamlEntry to be appended.
     */
    addEntry(entry: YamlEntry): void {
        this.yamlEntries.push(entry);
    }
}

/**
 * Class to represent the an entry in a yaml file.
 * Possible representations:
 *
 * 1) api: v1 -- key = 'api'; value? = 'v1'
 * 2) metadata:
 *      name: some_name
 * Complex entry, with nested data. Representation:
 * key: 'metadata'; value = null; values = [key = 'name'; value = 'some_name']; isNested = true
 *
 * 3) containers:
 *      - image: 'some_image'
 *        pull: 'true'
 *      - image: 'some_image_2'
 *        pull: 'false'
 * Array entry. Representation:
 * key: 'containers'; value = null; values = [ key = 'image'; value = 'some_image', key = 'image; value = 'some_image_2', ...]
 * isNested = false
 */
export class YamlEntry {
    key: string;
    value?: string;
    values?: YamlEntry[];
    isNested: boolean;

    constructor() {
        this.isNested = false;
    }

    /**
     * Recursive implementation of the yaml string builder, the logic is to test for every case of the 3 possible
     * cases depicted in the class docs.
     * @param indent number of spaces to use for indentation.
     * @param entryInstance node from which recursion starts
     * @param level level in the yaml document being created
     * @returns string int the yaml format
     */
    private stringReprHelper(indent: number, entryInstance: YamlEntry, level: number): string {
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

    /**
     * Builds a yaml representation of the YamlEntry.
     * @param indent number of spaces to use for indentation
     * @returns string in yaml format
     */
    stringRepr(indent?: number): string {
        return this.stringReprHelper(indent, this, 0);
    }
}
