export const mat1 = function () {
  const mat = [
    'шкіряний',
    'вонючий',
    'тупий',
    'сліпий',
    'йобаний',
    'відбитий',
    'йобнутий',
    'поїхавший',
    'конченый',
    'капитан',
    'адмирал',
    'дядя',
    'моржовий',
    'гнилий',
  ];
  const index = Math.floor(Math.random() * mat.length);
  return mat[index];
};
