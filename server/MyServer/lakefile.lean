import Lake
open Lake DSL

package myServer {
  -- add package configuration options here
}

@[default_target]
lean_exe myServer {
  root := `Main
}