export function calculateAge(birthDateIso: string): number {
  const birthDate = new Date(`${birthDateIso}T00:00:00`);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const hasNotHadBirthdayThisYear =
    today.getMonth() < birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate());

  if (hasNotHadBirthdayThisYear) age -= 1;
  return age;
}

export function formatBirthDate(birthDateIso: string): string {
  const [year, month, day] = birthDateIso.split("-");
  return `${day}/${month}/${year}`;
}
