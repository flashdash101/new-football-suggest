class PlayerStats(BaseModel):
    goals: Optional[int] = Field(alias='Gls', default=None)
    shots: Optional[int] = Field(alias='Sh', default=None)
    shots_on_target: Optional[int] = Field(alias='SoT', default=None)
    xG: Optional[float] = None
    xA: Optional[float] = None
    assists: Optional[int] = Field(alias='Ast', default=None)
    key_passes: Optional[int] = Field(alias='KP', default=None)
    progressive_passes: Optional[int] = Field(alias='PrgP', default=None)
    progressive_carries: Optional[int] = Field(alias='PrgC', default=None)
    tackles: Optional[int] = Field(alias='Tkl', default=None)
    interceptions: Optional[int] = Field(alias='Int', default=None)
    blocks: Optional[int] = None
    clearances: Optional[int] = Field(alias='Clr', default=None)
