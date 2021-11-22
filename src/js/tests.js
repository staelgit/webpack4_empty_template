///// ТЕСТЫ РАБОТОСПОСОБНОСТИ

//      babel

//async ... await
async function start() {
	return await Promise.resolve('Async await is working')
}
start().then(console.log);


// Classes
class Util {
	static id = Date.now()
}
console.log('id: ', Util.id);


//      eslint
const unused = 42;


//      lodash,        ленивая загрузка
import ('lodash').then( _ => {
	console.log('Lodash is working - ', _.random(0, 42, true))
});