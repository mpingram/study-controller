import deepObjectCompare from "./deep-object-compare";

describe("deepObjectCompare", () => {

  it("should identify when objects are the same", () => {

    const A = {
      foo: "1",
      bar: 2,
      baz: function(){
        console.log("baz");
      },
      bang: [
        "1",
        2,
        {
          bangFoo: function(){
            console.log("bangFoo");
          },
          bangBar: [
            [1,2,{bangBarFoo: "bangBarFoo"}],
            2,
            3
          ]
        }
      ]
    };
    const B = {
      foo: "1",
      bar: 2,
      baz: function(){
        console.log("baz");
      },
      bang: [
        "1",
        2,
        {
          bangFoo: function(){
            console.log("bangFoo");
          },
          bangBar: [
            [1,2,{bangBarFoo: "bangBarFoo"}],
            2,
            3
          ]
        }
      ]
    };

    expect(deepObjectCompare(A, B)).toBe(true);
  });

  it("should identify when objects are different", () => {
    const A = {
      foo: "1",
      bar: 2,
      baz: function(){
        console.log("baz");
      },
      bang: [
        "1",
        2,
        {
          bangFoo: function(){
            console.log("bangFoo");
          },
          bangBar: [
            [1,2,{bangBarFoo: "bangBarFooRIGHT"}],
            2,
            3
          ]
        }
      ]
    };
    const B = {
      foo: "1",
      bar: 2,
      baz: function(){
        console.log("baz");
      },
      bang: [
        "1",
        2,
        {
          bangFoo: function(){
            console.log("bangFoo");
          },
          bangBar: [
            [1,2,{bangBarFoo: "bangBarFooWRONG"}],
            2,
            3
          ]
        }
      ]
    };

    expect(deepObjectCompare(A,B)).toBe(false);
  });

  // FIXME: this behavior is unhelpful -- should just bite the bullet and write a custom object comparer for the test.
  it("should compare all numbers within a delta if passed a third numerical argument", () => {

    const A = {
      num1: 100,
      num2: 150,
      num3: 200
    };

    const B = {
      num1: 110,
      num2: 101,
      num3: 150
    };

    const delta = 50;

    expect(deepObjectCompare(A,B,delta)).toBe(true);
  });


});