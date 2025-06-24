function readPackage(pkg) {
  // Allow these specific packages to run their build scripts
  const packagesToApprove = ['supabase', '@tailwindcss/oxide', 'unrs-resolver', '@firebase/util', 'protobufjs'];
  
  if (packagesToApprove.includes(pkg.name)) {
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