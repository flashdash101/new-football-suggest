export const positionStats = {
  CB: ["Tkl", "Int", "Clr", "Blocks", "Cmp", "xA", "TklW"],
  FB: ["Tkl", "Int", "Cmp", "PrgC", "PrgP", "Ast", "Clr"],
  WB: ["Tkl", "Int", "PrgC", "PrgP", "Ast", "Clr"],
  DM: ["Tkl", "Int", "PrgP", "Cmp", "Blocks", "xA", "Ast", "KP"],
  CM: ["Cmp", "PrgP", "Ast", "KP", "Tkl", "Int", "xA"],
  AM: ["Ast", "KP", "xA", "PrgP", "Gls", "xG", "Cmp", "PrgC"],
  ST: ["Gls", "xG", "Sh", "SoT", "Ast", "xA"],
  W: ["Ast", "xA", "PrgC", "Gls", "xG", "onethird", "CPA", "Att", "Succ"],
};

export const positionMapping = {
  DF: ["CB", "FB", "WB"],
  MF: ["DM", "CM", "AM"],
  FW: ["ST", "W"],
};

export const defaultPositionStats = {
  DF: ["Tkl", "Int", "Clr", "Blocks", "Cmp"],
  MF: ["Cmp", "PrgP", "Ast", "KP", "Tkl", "Int"],
  FW: ["Gls", "xG", "Sh", "SoT", "Ast", "xA"],
};

export const statNames = {
  Tkl: "Tackles",
  Tklw: "Tackles that won team possesions",
  Int: "Interceptions",
  Clr: "Clearances",
  Blocks: "Blocks",
  Cmp: "Cmpes",
  xA: "Expected Assists",
  PrgC: "Progressive Carries",
  PrgP: "Progressive Passes",
  Ast: "Assists",
  KP: "Key Passes",
  Gls: "Goals",
  xG: "Expected Goals",
  Sh: "Shots",
  SoT: "Shots on Target",
  onethird: "Carries into the Final Third",
  CPA: "Carries into Penalty Area",
  Att: "Dribbles Attempted",
  Succ: "Successful Dribbles",
  Cmp: "Completed passes",
};
