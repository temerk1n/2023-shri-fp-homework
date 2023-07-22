/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */
import {allPass, anyPass, compose, count, curry, equals, prop} from "ramda";
import {COLORS, SHAPES} from '../constants'

const isWhite = equals(COLORS.WHITE);
const isRed = equals(COLORS.RED);
const isGreen = equals(COLORS.GREEN);
const isBlue = equals(COLORS.BLUE);
const isOrange = equals(COLORS.ORANGE);
const isNotWhite = color => color !== COLORS.WHITE;
const shapesHasSameColor = (shape1, shape2) => equals(shape1, shape2);
const triangleColorEqualsSquare = shapes => shapesHasSameColor(getTriangleColor(shapes), getSquareColor(shapes));

const getColor = shape => prop(shape);
const getSquareColor = getColor(SHAPES.SQUARE);
const getStarColor = getColor(SHAPES.STAR);
const getCircleColor = getColor(SHAPES.CIRCLE);
const getTriangleColor = getColor(SHAPES.TRIANGLE);

const greater1 = count => count > 1;
const less2 = count => count <= 1
const equals1 = count => count === 1;
const equals2 = count => count === 2;
const equals4 = count => count === 4;

const starIsRed = compose(isRed, getStarColor);
const squareIsGreen = compose(isGreen, getSquareColor);
const circleIsWhite = compose(isWhite, getCircleColor);
const triangleIsWhite = compose(isWhite, getTriangleColor);
const circleIsBlue = compose(isBlue, getCircleColor);
const squareIsOrange = compose(isOrange, getSquareColor);
const triangleIsGreen = compose(isGreen, getTriangleColor);
const triangleIsNotWhite = compose(isNotWhite, getTriangleColor);
const shapeIsNotRedOrWhite = anyPass([isBlue, isOrange, isGreen]);

const currentColors = shapes => Object.values(shapes);
const countColor = curry((colorFunc, shapes) => count(colorFunc, currentColors(shapes)));
const countGreen = countColor(isGreen)
const countRed = countColor(isRed);
const countBlue = countColor(isBlue);
const countWhite = countColor(isWhite);
const countOrange = countColor(isOrange);
const twoGreenShapes = compose(equals2, countGreen);
const oneRedShape = compose(equals1, countRed);
const redCountEqualsBlue = (shapes) => equals(countRed(shapes), countBlue(shapes));

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = allPass([
    starIsRed,
    squareIsGreen,
    circleIsWhite,
    triangleIsWhite
])

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = compose(greater1, countGreen);

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = redCountEqualsBlue;

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 =  allPass([
    circleIsBlue,
    starIsRed,
    squareIsOrange
]);

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = compose(less2, countWhite);

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = allPass([
    twoGreenShapes,
    triangleIsGreen,
    oneRedShape
]);

// 7. Все фигуры оранжевые.
export const validateFieldN7 = compose(equals4, countOrange);

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = compose(shapeIsNotRedOrWhite, getStarColor);

// 9. Все фигуры зеленые.
export const validateFieldN9 = compose(equals4, countGreen);

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = allPass([
    triangleColorEqualsSquare,
    triangleIsNotWhite
]);
