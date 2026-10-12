# Sabotage

A mobile-friendly JavaScript adaptation of Peter Adams's 1982 Atari BASIC game, with a custom computer boss room.

Open index.html to play locally. Move with arrow keys or WASD, fire with Space, and pause with P. Touch controls are provided. Sound starts enabled and can be toggled.

Disable six control boxes to open the right exit. Boxes regenerate after 30, 28, 26, and 24 seconds in rooms 1–4. Their timers survive a lost life. Room 5 features five layers of breakable bricks around an eight-hit computer, with alternating top and bottom lasers. Destroy the computer and escape right. Earn an extra life every 20 points.

Shoot exposed lasers from either side to disable them temporarily. Each laser awards its 5-point bonus once. Three starting lives; completing a mission preserves score and remaining lives.

Run `node test.cjs` for gameplay regression checks.

## Hosting

In Settings → Pages, choose Deploy from a branch, then main and /(root), and Save.

Original game: Peter Adams, SoftSide (1982). Browser adaptation created from user-provided scans and subsequent gameplay requests.
