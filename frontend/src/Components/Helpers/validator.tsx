import PasswordValidator from "password-validator";

const schema = new PasswordValidator();
schema.is().min(6)
.has().lowercase()
.has().digits(1)
.has().symbols(1);

type ValidationReasons = {
    validation: string
    arguments: number | undefined
    message: string
}[];

export function passwordValidator(password: string) {
    const errorList = schema.validate(password, { list: true, details: true }) as ValidationReasons;
    if (errorList.length == 0) return true;

    return <div className="validator-reasons-list">
        <div className="title">Password Invalid:</div>
        <ul className="validator-reasons">
            {
                errorList.map((err, i) => {
                    return <li 
                        key={i}
                    >
                        <span className="vali">{err.validation}: </span> 
                        <span
                            dangerouslySetInnerHTML={{
                                __html: err.message.replace(
                                    `${err.arguments ?? 1}`,
                                    `<b>${err.arguments ?? 1}</b>`
                                ).replace('The string should have a', '')
                                .replace('of', '')
                            }}
                        ></span>
                    </li>
                })
            }
        </ul>
    </div>
}

const schemaU = new PasswordValidator();
schemaU.is().min(4)
.is().not().spaces();

export function usernameValidator(username: string) {
    const errorList = schemaU.validate(username, { list: true, details: true }) as ValidationReasons;
    if (errorList.length == 0) return true;

    return <div className="validator-reasons-list">
        <div className="title">Username Invalid:</div>
        <ul className="validator-reasons">
            {
                errorList.map((err, i) => {
                    return <li 
                        key={i}
                    >
                        <span className="vali">{err.validation.replace('min', 'length')}: </span> 
                        <span
                            dangerouslySetInnerHTML={{
                                __html: err.message.replace(
                                    `${err.arguments ?? "not"}`, 
                                    `<b>${err.arguments ?? "not"}</b>`
                                ).replace('The string', '')
                            }}
                        ></span>
                    </li>
                })
            }
        </ul>
    </div>
}