module.exports = function () {
  const mat = [
    'кожаный',
    'вонючий',
    'тупой',
    'слепой',
    'ебаный',
    'отбитый',
    'йобнутый',
    'поехавший',
    'ебанутый',
    'конченый',
    'ебаный',
    'капитан',
    'адмирал',
    'дядя',
    'моржовый',
    'гнилой',
  ];
  const index = Math.floor(Math.random() * mat.length);
  return mat[index];
};
