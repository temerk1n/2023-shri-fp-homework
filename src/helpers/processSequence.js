/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}*/
import Api from '../tools/api';
import {
    allPass,
    gt,
    __,
    andThen,
    toString,
    pipe,
    ifElse,
    prop,
    lt, otherwise, tap
} from "ramda";
import {isNumber, toNumber} from "lodash/lang";

const api = new Api();

const wait = time => new Promise(resolve => {
    setTimeout(resolve, time);
})

const getLength = str => str.length;
const gt0 = gt(__, 0);
const gt2 = gt(__, 2);
const lt10 = lt(__, 10);
const isValidLength = pipe(
    getLength,
    allPass([gt2, lt10])
);
const isValidNumber = pipe(toNumber, isNumber);
const isPositive = pipe(toNumber, gt0);
const isValidInput = allPass([
    isPositive,
    isValidNumber,
    isValidLength,
]);

const roundValue = pipe(toNumber, Math.round);
const pow2 = value => value * value;
const mathMod3 = value => value % 3;
const getBinaryNumberLength = pipe(toString, getLength);
const getApiResponse = prop('result');
const getBinaryValueFromApi = value => api.get('https://api.tech/numbers/base', {from: 10, to: 2, number: value});
const getAnimalById = id => api.get(`https://animals.tech/${id}`, {});
const processSequence = ({value, writeLog, handleSuccess, handleError}) => {
    const log = tap(writeLog);
    // const curriedLog = curry(log);
    // const logStartValue = curriedLog('Start value: ');
    // const logRoundedValue = curriedLog('Rounded value: ');
    // const logBinaryValue = curriedLog('Binary value: ');
    // const logValueLength = curriedLog('Value length: ');
    // const logSquareNumber = curriedLog('Square value: ');
    // const logMod3 = curriedLog('Remainder: ');

    const handleValidationError = () => handleError("ValidationError");
    const handleNetworkError = () => handleError("NetworkError");

    const roundValueAndLog = pipe(roundValue, log);
    const getBinaryNumberFromApiResponse = pipe(getApiResponse, log);
    const getBinaryNumberLengthAndLog = pipe(getBinaryNumberLength, log);
    const pow2AndLog = pipe(pow2, log);
    const mod3AndLog = pipe(mathMod3, log);
    const getAnimalByIdFromApiAndLogSuccessOrError = pipe(
        getAnimalById,
        andThen(pipe(getApiResponse, handleSuccess)),
        otherwise(handleNetworkError)
    )

    const handleSuccessfulResponse = pipe(
        getBinaryNumberFromApiResponse,
        getBinaryNumberLengthAndLog,
        pow2AndLog,
        mod3AndLog,
        getAnimalByIdFromApiAndLogSuccessOrError
    );

    const handleValidInput = pipe(
        roundValueAndLog,
        getBinaryValueFromApi,
        andThen(handleSuccessfulResponse),
        otherwise(handleNetworkError)
    )

    const process = pipe(
        log,
        ifElse(
            isValidInput,
            handleValidInput,
            handleValidationError
        )
    )

    process(value);
}

export default processSequence;
