import { LeanWebConfig } from './docs' // look here for documentation of the individual config options

const lean4webConfig : LeanWebConfig = {
  "projects": [
    { "folder": "MathlibDemo",
      "name": "Stable Mathlib",
      "examples": [
        { "file": "MathlibDemo/Bijection.lean",
          "name": "Bijection" },
        { "file": "MathlibDemo/Logic.lean",
          "name": "Logic" },
        { "file": "MathlibDemo/Ring.lean",
          "name": "Ring" },
        { "file": "MathlibDemo/Rational.lean",
          "name": "Rational" }]},
    { "folder": "Stable",
      "name": "Lean Only",
      "examples": [
        { "file": "Stable/SampleDoc.lean",
          "name": "Verso document" }
      ]},
  ],
  "serverCountry": 'Finland',
  "contactDetails": null,
  "impressum": null
}

export default lean4webConfig
