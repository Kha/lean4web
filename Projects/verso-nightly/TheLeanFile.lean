import  VersoManual
open Verso Doc
open Verso.Genre Manual
open Verso.Genre.Manual.InlineLean

set_option doc.verso true

/--
Example using lean docstrings, enabling us
to explain that this is a {Lean.Doc.name}`Nat`
equivalent to {Lean.Doc.lean}`Nat.zero.succ.succ.succ`.
-/
def x := 4

#doc (Manual) "Mydoc" => Would you like a doc?I'll give you a doc if you'd like.
