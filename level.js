/**
 * Holds info and behavior for a level itself including the timer, and any
 * junk it might contain.
 **/
class Level {
  static LIVES_PAD_BOTTOM = 40;
  static LIVES_PAD_LEFT = 40;
  static LIVES_GAP = 18;
  static LIVES_SCALE = 0.6;
  static HUD_TEXT_SIZE = 48;
  static HUD_PAD = 20;

  name;
  junk;
  time;

  constructor(levelConfig) {
    this.name = levelConfig.name;
    this.junk = [];
    for (let i = 0; i < levelConfig.junk; i++) {
      this.junk.push(new Junk());
    }
    this.time = {
      initial: levelConfig.time,
      elapsed: 0,
    };
  }

  /** Give the remaining time for this level in milliseconds. */
 timeLeft() {
  return Math.max(0, this.time.initial - this.time.elapsed);
}

  /**
   * Draws the UI chrome (timer, score, and lives) and the level's junk. The
   * Magpie and Mothership are drawn by Game, which also passes in the score
   * and lives.
   **/
  draw(score, lives) {
  push();

  // Timer and score
  noStroke();
  fill("#FFE6A7");
  textSize(Level.HUD_TEXT_SIZE);

  const parts = timeToStringParts(this.timeLeft());

  textAlign(LEFT, TOP);
  text(
    `${parts.minutes}:${parts.seconds}`,
    Level.HUD_PAD,
    Level.HUD_PAD
  );

  textAlign(RIGHT, TOP);
  text(score, width - Level.HUD_PAD, Level.HUD_PAD);

  // Spare ships
  for (let i = 0; i < lives - 1; i++) {
    push();
    translate(
      Level.LIVES_PAD_LEFT + i * Level.LIVES_GAP,
      height - Level.LIVES_PAD_BOTTOM
    );
    scale(Level.LIVES_SCALE);
    Magpie.drawMagpie({ rotation: 0, beam: false });
    pop();
  }

  // Junk
  for (const junk of this.junk) {
    junk.draw();
  }

  pop();
}

  /**
   * Moves anything owned by the level (junk, comets, etc). If the `countTime`
   * argument is present and false, the timer doesn't advance, but everything
   * still moves.
   **/
  move(delta, { countTime = true } = {}) {
    // the timer counts game time, not wall-clock time, so it stops whenever
    // move() isn't called (e.g. while paused), or when countTime is false.
    if (countTime) {
      this.time.elapsed += delta;
    }
    for (const junk of this.junk) {
      junk.move(delta);
    }
  }

  removeJunk(junkToRemove) {
    this.junk = this.junk.filter((j) => j !== junkToRemove);
  }
}
