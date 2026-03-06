{
  description = "Tag Folder Plus Obsidian plugin (fork of TagFolder)";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    { nixpkgs, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = import nixpkgs { inherit system; };
      in
      {
        # Production build
        packages.default = pkgs.buildNpmPackage {
          pname = "obsidian-tagfolder-plus";
          version = "0.18.13";

          src = ./.;

          npmDepsHash = "sha256-OVYflk1Q5k77Dpx8jHfd6ZiUs/SxGSQBt7d6ToPeNAY=";

          # Node 22 for --env-file support and modern ESM
          nodejs = pkgs.nodejs_22;

          buildPhase = ''
            npm run build
          '';

          installPhase = ''
            mkdir -p $out
            cp main.js manifest.json styles.css $out/
          '';

          # No tests to run
          doCheck = false;
        };

        # Development shell
        devShells.default = pkgs.mkShell {
          buildInputs = [
            pkgs.nodejs_22
          ];

          shellHook = ''
            echo "TagFolder Plus dev environment"
            echo "  npm install   — install dependencies"
            echo "  npm run dev   — watch build (set PATHS_TEST_INSTALL to auto-copy)"
            echo "  npm run build — production build"
          '';
        };
      }
    );
}
