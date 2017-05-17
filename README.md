## Directory Structure
```
├── index.js
├── lib
│   ├── README
│   ├── package.js
│   ├── scrapper.js
│   └── utils.js
├── package.json
├── packages
├── spec
│   ├── package.spec.js
│   └── scrapper.spec.js
├── test.js
└── tmp
```

## Install

```
> git clone https://github.com/tiabas/npm-most-depended.git
```

```
> cd npm-most-depended
> npm install
```

## To run
*IMPORTANT* Ensure that the directory `temp` exists or is created in the project's folder.
It will be used to temporarily store downloaded tars before extracting them to their final
destination.
The purpose of the temp directory is to ensure that corrupt files or partial downloads do not
pollute the packages directory.
```
> mkdir temp
```

And then run the test
```
> npm run test
```

To run the unit tests. Use the command below
```
> npm run spec
```

## Issues Encountered
#### New programming paradigm
- Learning NodeJS and ES6+ from basically zero
- Programming async is a trick coming from synchronous programming

#### Maintaing sanity while working with callbacks
- Ended up using promises. 
- Promises prevent callback hell but, it took a bit of trial and error and lots of
  research untill I was able to implement them in a way the made logicall sense

#### Testing
- I'm a big proponent of having through tests but, couldn't get all the scaffold in place.
  I gave it a shot but and only gave up when I couldn't figure out how to stub promises

#### NodeJS Conventions
- I have no idea what good practices are for NodeJS. If something in here is cringeworthy, I 
  worked with the best knowledge I had. 