import { UiComponents, CategoryComponent } from './ui-components';

describe('UiComponents', () => {
  it('should create an instance', () => {
    expect(new UiComponents()).toBeTruthy();
  });
});

describe('CategoryComponent#getFormSchema', () => {
  it('should return json schema for form generation', () => {
    // Define components
    const root: CategoryComponent = new CategoryComponent();
    root.categoryComponentLabel = 'root';
    root.categoryComponentDescription = 'root description';

    const childNested01 = new CategoryComponent();
    childNested01.categoryComponentLabel = 'child01';
    childNested01.categoryComponentDescription = 'child desc';

    const child01Array = new CategoryComponent();
    child01Array.categoryComponentLabel = 'child array';
    child01Array.categoryComponentDescription = 'child array desc';

    childNested01.categoryComponents.push(child01Array);

    const child02Array = new CategoryComponent();
    child02Array.categoryComponentLabel = 'child 2 array';
    child02Array.categoryComponentDescription = 'child 2 array desc';

    childNested01.categoryComponents.push(child02Array);

    root.categoryComponents.push(childNested01);

    // expected json schema
    const expectedJsonStr = `
    {
      "schema": {
        "type": "object",
        "properties": {
          "root": {
            "type": "object",
            "properties": {
              "child01": {
                "type": "array",
                "items": [
                  {
                    "child array": { "type": "string" }
                  },
                  {
                    "child 2 array": { "type": "string" }
                  }
                ],
                "required": ["child array", "child 2 array"]
              }
            }
          }
        },
        "required": [ "root" ]
      }
    }
    `;
    console.log(CategoryComponent.getFormSchema(root));
    console.log(JSON.stringify(JSON.parse(expectedJsonStr)));
    expect(JSON.parse(CategoryComponent.getFormSchema(root))).toEqual(JSON.parse(expectedJsonStr));
  });
});
