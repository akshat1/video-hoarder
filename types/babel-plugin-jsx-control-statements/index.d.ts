import React from "react";

declare var If: React.SFC<{ condition: boolean }>;
declare var For: React.SFC<{ each: string; index: string; of: Array<any> }>;
declare var Choose: React.SFC;
declare var When: React.SFC<{ condition: boolean }>;
declare var Otherwise: React.SFC;
