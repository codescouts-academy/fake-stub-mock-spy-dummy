# Test dobles

Los test dobles hacen alusión a los dobles en hollywood donde un actor que tiene que hacer una escena riesgosa contrata un doble para que la realice; En los tests tenemos exactamente lo mismo.
Estos dobles de test nos permitirán cambiar su implementación dependiendo el escenario que necesitemos testar, cada uno de ellos tiene una forma y un objetivo de uso.
Cada vez que preguntamos en nuestras sesiones si saben la diferencia, siempre se confunden estos conceptos, así que en este post intentaré que te quede claro de una vez por todas, vamos! 🚀

## Dummy

### ¿Qué es un dummy?

Un dummy es una implementación que no realiza nada, cada método de una **_interface_** es implementada para que no haga nada, Si el método retorna un valor, entonces ete retornará un valor lo más cercano a null o cero.

Supongamos que tenemos la siguiente **_interface_**

```typescript
export interface Authenticator {
    authenticate(userName: string, password: string): boolean;
}
```

La implementación de nuestro dummy será 👇

```typescript
class AuthenticatorDummy implements Authenticator {
    public authenticate(userName: string, password: string): boolean {
        throw new Error("Not implemented");
    }
}
```

Y lo usaremos así 👇

```typescript
test("get exception if username is empty", ()=> {
    const authenticatorDummy = new AuthenticatorDummy();
    const login = new Login(authenticatorDummy);

    const authorize = ()=> login.authorize("", "Some password");

    expect(authorize).toThrow("Username can not be empty");
})
```

### ¿Cuándo usamos un dummy?

Un dummy es un test doble donde implementa una **_interface_** qué no hace nada y es usado cuando la función que vamos a testear toma un objeto como argumento, pero la lógica en cuestión no utiliza o no requiere que el objeto este presente.
En otras palabras, implementamos la abstracción solo para poder instanciar la clase que nos interesa testar pero no usamos esa dependencia en el test en cuestión.

Personalmente no utilizo los dummies demasiado por 2 razones: 

1.  No me gusta tener funciones donde partes del código no utiliza sus argumentos.
2.  No me gustan los objetos que tienen cadenas de dependencias.

Pero a veces prefiero utilizar dummies en lugar de pelear con objetos complicados de una aplicación cuando trabajo con código legacy.

## Stub

### ¿Qué es un Stub?

Los stubs son objetos dummies también que están implementados para hacer nada, pero a diferencia de los dummies, las funciones de los Stubs retornan valores que permiten cambiarse dependiendo del test qué estemos realizando.

Supongamos que tenemos este test

```typescript
test("authentication is rejected when username or password are incorrect", ()=> {
    const rejectAuthorizer= new RejectAuthorizer();
    const login = new Login(rejectAuthorizer);

    const success = login.authorize("Wrong username", "Wrong password");

    expect(success).toBeFalsy();
})
```

Entonces nuestro Stub será algo así cierto 🤔

```typescript
class RejectAuthorizer implements Authenticator {
    public authenticate(userName: string, password: string): boolean {
        return false;
    }
}
```

Pero si queremos hacer un test donde el login sea correcto podremos generar un Stub que lo permita

```typescript
class SuccessAuthorizer implements Authenticator {
    public authenticate(userName: string, password: string): boolean {
        return true;
    }
}
```

Y ahora en nuestro test

```typescript
test("authentication is success when user name and password are correct", ()=> {
    const successAuthorizer= new SuccessAuthorizer();
    const login = new Login(successAuthorizer);

    const success = login.authorize("Wrong username", "Wrong password");

    expect(success).toBeTruthy();
})
```

### ¿Cuando usamos un Stub?

Los Stubs debemos utilizarlo cuando queremos tener diferentes implementaciones de nuestro dummy de tal manera que podamos condicionar nuestro valor de respuesta para cada casuística que testemos.

## Spy

### ¿Qué es un Spy?

Un Spy es un Stub que tiene la habilidad de cambiar el valor de respuesta cada vez que nosotros queramos dependiendo el path que estemos testando de nuestro código. Sin embargo los Spies tienen la habilidad también de recordar la cantidad de veces que ha sido llamado un determinado método o incluso recordar los valores con los que lo hemos utilizado.

Por ejemplo implementemos un Spy del caso que venimos viendo

```typescript
export class AuthenticationSpy implements Authenticator {
    private count: number = 0;
    private result: boolean = false;

    private lastUserName: string = "";
    private lastPassword: string = "";

    public authenticate(userName: string, password: string): boolean {
        this.count++;
        this.lastUserName = userName;
        this.lastPassword = password;

        return this.result;
    }

    public get times(): number {
        return this.count;
    }

    public changeResult(newResult: boolean) {
        this.result = newResult;
    }

    public get lastUserNameUsed() {
        return this.lastUserName;
    }

    public get lastPasswordUsed() {
        return this.lastPassword;
    }
}
```

```typescript
test("the user try to authenticate the authorizer authentication call once time", ()=> {
    const authenticationSpy= new AuthenticationSpy();
    authenticationSpy.changeResult(true);

    const login = new Login(authenticationSpy);

    const success = login.authorize("Wrong username", "Wrong password");

    expect(success).toBeTruthy();
    expect(authenticationSpy.times).toBe(1);
})
```

Los Spies pueden ser simples e incluso retornar un único valor o incluso pueden ser complejos guardando un historial completo de cada valor que se ha cambiado por cada vez que se ha invocado la función.

### ¿Cuándo usamos Spies?

En caso que nosotros necesitemos asegurar que una determinada función es llamada con determinados argumentos en un determinado momento es necesario utilizar Spies, ya que ellos tienen la habilidad de recordar estos valores, cómo cuantas veces se ha llamado una función con qué argumentos y qué ha devuelto.

## Mocks

### ¿Qué son los Mocks?

Los Mocks son Spies que retornan valores específicos para cada tests, qué recuerdan cuantas veces y con qué argumentos se ha invocado una función, sin embargo los Mocks también saben si el test debe fallar o no dependiendo cómo se configure.
En otras palabras las aserciones de los tests estarán escritas dentro del Mock.

Por ejemplo miremos la implementación de este Mock.

```typescript
class AuthenticatorMock extends AuthenticationSpy /* 👈 Extends previous Spy created */ {
    constructor(private readonly expectedUsername: string,
        private readonly expectedPassword: string,
        private readonly authenticateCalling: number) {
        super()
    }

    public validate(): boolean {
        return this.authenticateCalling === this.times &&
            this.expectedUsername === this.lastUserNameUsed &&
            this.expectedPassword === this.lastPasswordUsed;
    }
}
```

Entonces en nuestro test podemos hacer algo así

```typescript
test("the login is correct when user and password are correct", ()=> {
    const authenticationMock = new AuthenticatorMock("Code", "Scouts", 1);
    authenticationMock.changeResult(true);
    const login = new Login(authenticationMock);

    const success = login.authorize("Code", "Scouts");

    expect(success).toBeTruthy();
    expect(authenticationMock.validate()).toBeTruthy();
})
```

### ¿Cuándo utilizamos los Mocks?

Los Mocks los podemos utilizar no solo por el mismo motivo que un Spy, sino también para poder concentrar el criterio de aceptación dentro de un determinado objeto, obviamente cuando nuestro criterio de aceptación es tal vez un poco más complejo o cuando querremos verificar el estado interno del Spy teniendo "cierta inteligencia" dentro de estos mismos.

## Fake

### ¿Qué es un Fake?

Dentro de los dobles de tests, nos queda por explicar los Fakes, estos no son Dummies, no son Stubs, no son Spies y tampoco son Mocks, los Fakes son simuladores, es decir, los Fakes definen reglas de negocio falsas para probar determinados escenarios más complejos.

Veamos un ejemplo que es más fácil 👇

```typescript
class AuthorizationFake implements Authenticator {
    public authenticate(userName: string, password: string): boolean {
        return userName === "Code" && password === "Scouts";
    }
}
```

```typescript
test("authentication is rejected when username or password are incorrect", ()=> {
    const authorizationFake= new AuthorizationFake();
    const login = new Login(authorizationFake);

    const success = login.authorize("Wrong username", "Wrong password");

    expect(success).toBeFalsy();
})
```

```typescript
test("authentication is success when username and password correct", ()=> {
    const authorizationFAke= new AuthorizationFAke();
    const login = new Login(authorizationFAke);

    const success = login.authorize("Code", "Scouts");

    expect(success).toBeTruthy();
})
```

### ¿Cuándo usamos Fakes?

Los Fakes nos ayudan mucho cuando tenemos escenarios más complejos, o queremos ahorrar el setup de nuestros tests, podemos crear Fakes específicos para cada uno de esos setups repetitivos en nuestros test y que nuestro Fake pueda condicionar nuestros tests dentro dependiendo de los valores con los que se invoque.

Espero que ahora quede claro qué son cada uno de estos tests dobles.
Pero no me quiero ir sin antes dejarles un pequeño resumen.

-   Dummy: Un dummy es una implementación que no realiza nada
-   Sub: Dummy que retorna valores específicos para cada escenario
-   Spy: Un Spy es un Stub que tiene la habilidad de cambiar el valor de respuesta cada vez que nosotros queramos
-   Mocks: Son Spies que tiene lógica de aserción internamente.
-   Fake: Simuladores que tienen un determinado escenario de fallo o de aserción complejo o dependiente de un estado interno.

Espero que les sirva esta explicación teórica y práctica te dejo aquí el repositorio con el código para que puedas revisarlo con detenimiento.
👉 [Repo](https://github.com/codescouts-academy/fake-stub-mock-spy-dummy)

Si te gustó compártelo que nos ayudaría mucho a que les llegue a todo el mundo 👇

Un saludo 👋
