const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

const emptyModulePath = path.resolve(__dirname, 'empty-module.js');

// Mock web-only 3D reconcilers for native Hermes bundle resolution
config.resolver.extraNodeModules = new Proxy(
  {
    '@react-three/fiber': emptyModulePath,
    '@react-three/drei': emptyModulePath,
    '@react-three/xr': emptyModulePath,
  },
  {
    get: (target, name) => (name in target ? target[name] : path.join(__dirname, `node_modules/${name}`)),
  }
);

module.exports = config;
