function readPackage(pkg, context) {
  // This hook is called for every package being installed.
  // We check if the package name is one we want to approve.
  if (pkg.name === 'supabase' || pkg.name === '@tailwindcss/oxide') {
    // pnpm ignores 'postinstall' scripts by default. By moving the script
    // to 'install', we tell pnpm that it's a critical part of the
    // package installation and should be run.
    if (pkg.scripts && pkg.scripts.postinstall) {
      pkg.scripts.install = pkg.scripts.postinstall;
    }
  }
  return pkg;
}

module.exports = {
  hooks: {
    readPackage,
  },
}; 