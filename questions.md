To be honest I have no experience in class-based React development so answers may be unclear. 

### 1. What is the difference between Component and PureComponent? give an example where it might break my app.

I have experience only with Functional Components, so I'm able only to suggest.
Some time ago I saw description of PureComponent like "Component with shallowed prop comparison", so I may suggest,
PureComponent is faster than Component in cases with complex Props structure. Meantime in PureComponent developer must declare proper
props comparison algorithm.

### 2. Context + ShouldComponentUpdate might be dangerous. Can think of why is that?

ShouldComponentUpdate able to check props and state only. React cannot guarantee proper context insertion in ShouldComponentUpdate.
So danger here is in unavailability to rerender component tree depending on Context updates. 

### 3. Describe 3 ways to pass information from a component to its PARENT
1. `[_, setState] = useState()`'s setState passed as Prop
2. `[_, setState] = useState()`'s setState passed as Context
3. via state manager

### 4. Give 2 ways to prevent components from re-rendering.

For FunctionalComponents applies memoization like 
```js
React.memo((props) => <div {...props} />, someOptionalEquityFunction)
```

For ClassComponents applies props/store comparison logic written in `shouldComponentUpdate`.

Another way is to use PureComponent (thanks to question 1 :)

### 5. What is a fragment and why do we need it? Give an example where it might break my app.

React fragment is Virtual component with no DOM representation (e.g. it will not break flexbox layout).
It solves problem of rendering array of child elements.
I cannot suggest any problems with it because its regular component without dom representation.

### 6. Give 3 examples of the HOC pattern.
Nowadays, React team suggested not to use HOC because it's build wrapper-component. But I saw HOCs in actual Relay and Apollo libraries.
Before hooks, HOC was actively used for (1) sharing logic between class components and (2) transforming incoming props.
It's hard for me to remember 3rd example of HOC usage because I met React in era of hooks.

### 7. What's the difference in handling exceptions in promises, callbacks and async...await.
Errors in promises handled by `catch` method of Promise chain:
```js
(new Promise((resolve, reject) => reject(new Error('foo'))))
.catch(err) // err is Error: { message: 'foo' } 
```

Errors in callbacks historically handled assuming first argument is error object or null:
```js
const callback = (err, ...args) => { if (err) { console.error(err); return; } /* handling rest of args */ }
```

Errors on async/await handled by try ... catch expressions:
```js
(async () => {
    try {
        await Promise.reject(new Error('foo'));
    } catch (err) {
       // err is Error: { message: 'foo' }
    }
})()
```

### 8. How many arguments does setState take and why is it async.
I'm able to describe only `useState`'s setState method - it is sync and expecting single argument meaning whole new state or function which produces new state based on current one and incoming.

### 9. List the steps needed to migrate a Class to Function Component.
We need to replace lifecycle methods by analogs in hooks (this.state => useState, componentDid(Un)Mount => useEffect), etc.
Maybe project already have custom hooks which may be applied to current component. 
Migrate typings to newborn FC.

### 10. List a few ways styles can be used with components.
* `<div styles={{ display: block }} />`
* `<div className={cnFromImportedCSSModule} />`
* `<div className="constant cn declared as :global(.cn) somwhere in css files" />`

### 11. How to render an HTML string coming from the server.
```js
<div dangerouslySetInnerHTML={{__html: 'Foo bar <script>alert(document.cookie)</script>'}} />
```
We should use this approach only when HTML string contain sanitized user input.
I used this approach to [highlight match](https://github.com/vaseker/deel-test/blob/main/src/components/Suggest/Elem.tsx#L15) in suggested items.
