const requiredTarget = process.env.FLASHMEDIC_REQUIRE_VERCEL_TARGET;

if (requiredTarget) {
  const actualTarget = process.env.VERCEL_ENV;
  if (actualTarget !== requiredTarget) {
    throw new Error(
      `Refusing FlashMedic build: expected Vercel target ${requiredTarget}, received ${actualTarget ?? "unset"}.`,
    );
  }
}
