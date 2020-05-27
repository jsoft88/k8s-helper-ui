import { YamlDocument, YamlEntry } from './yaml-block';

describe('Create simple yaml document', () => {
  const yamlDocument = new YamlDocument(2);
  const simpleEntry = new YamlEntry();

  simpleEntry.key = 'key';
  simpleEntry.value = 'value';

  yamlDocument.addEntry(simpleEntry);

  console.log(yamlDocument.buildDocument());

  it('generated document should match expected simple entry', () => { expect(yamlDocument.buildDocument()).toBe('key: value'); });
});

describe('Create a yaml with a complex value', () => {
  const yamlDocument = new YamlDocument(2);
  const complexEntry = new YamlEntry();

  complexEntry.key = 'complexKey';
  complexEntry.values = [];
  complexEntry.isNested = true;

  const complexEntryValue = new YamlEntry();
  complexEntryValue.key = 'key';
  complexEntryValue.value = 'value';

  complexEntry.values.push(complexEntryValue);

  yamlDocument.addEntry(complexEntry);

  console.log(`Complex entry:\n${yamlDocument.buildDocument()}`);

  it('generated document should match expected complex entry', () => { expect(true).toBeTruthy(); });
});

describe('Create a yaml document with array values', () => {
  const yamlDocument = new YamlDocument(2);
  const complexEntry = new YamlEntry();

  complexEntry.key = 'arrayKey';
  complexEntry.values = [];

  const arrayEntry = new YamlEntry();
  arrayEntry.key = 'entry01';
  arrayEntry.value = 'value01';

  const arrayEntry02 = new YamlEntry();
  arrayEntry02.key = 'entry02';
  arrayEntry02.value = 'value02';

  complexEntry.values.push(arrayEntry);
  complexEntry.values.push(arrayEntry02);

  yamlDocument.addEntry(complexEntry);

  console.log(yamlDocument.buildDocument());

  it('generated document should match expected array entry', () => { expect(true).toBeTruthy(); });
});

describe('Create mixed yaml document', () => {
  const yamlDocument = new YamlDocument(2);
  const simpleEntry = new YamlEntry();

  simpleEntry.key = 'key';
  simpleEntry.value = 'value';

  const arrayBlock = new YamlEntry();

  arrayBlock.key = 'arrayKey';
  arrayBlock.values = [];

  const arrayEntry = new YamlEntry();
  arrayEntry.key = 'entry01';
  arrayEntry.value = 'value01';

  const arrayEntry02 = new YamlEntry();
  arrayEntry02.key = 'entry02';
  arrayEntry02.value = 'value02';

  const arrayEntry03 = new YamlEntry();
  arrayEntry03.key = 'entry03';
  arrayEntry03.values = [];
  arrayEntry03.values = [new YamlEntry()];
  arrayEntry03.isNested = true;
  arrayEntry03.values[0].key = 'complexInnerArrayKey';
  arrayEntry03.values[0].value = 'complexInnerArrayValue';

  arrayBlock.values.push(arrayEntry);
  arrayBlock.values.push(arrayEntry02);
  arrayBlock.values.push(arrayEntry03);

  const complexEntry = new YamlEntry();

  complexEntry.key = 'complexKey';
  complexEntry.values = [];
  complexEntry.isNested = true;

  const complexEntryValue = new YamlEntry();
  complexEntryValue.key = 'key';
  complexEntryValue.value = 'value';

  complexEntry.values.push(complexEntryValue);

  yamlDocument.addEntry(simpleEntry);
  yamlDocument.addEntry(arrayBlock);
  yamlDocument.addEntry(complexEntry);

  console.log(`mixed entries:\n${yamlDocument.buildDocument()}`);

  it('generated document should match expected array entry', () => {
    expect('\n' + yamlDocument.buildDocument()).toBe(
      '\nkey: value\narrayKey:\n- entry01: value01\n  entry02: value02\n  entry03:\n    complexInnerArrayKey: complexInnerArrayValue' +
      '\n\ncomplexKey:\n  key: value');
  });
});

describe('YamlBlock', () => {
  it('should create an instance', () => {
    expect(new YamlDocument(2)).toBeTruthy();
  });
});
