"""
Seamless horizontally-tileable cloud strips.

The tiling trick: build the noise on a CYLINDER. Sample x around a circle so
the left and right edges are literally the same points in the noise field --
there is no seam to hide. Vertical edges are faded out with a window instead,
since the strip never repeats vertically.
"""
import numpy as np
from PIL import Image

RNG = np.random.default_rng(7)

def value_noise_cylindrical(w, h, fx, fy):
    """One octave of value noise, periodic in x with period fx."""
    gx, gy = int(fx), int(fy)
    grid = RNG.random((gy + 1, gx + 1))
    grid[:, -1] = grid[:, 0]          # wrap x -> seamless
    xs = np.linspace(0, gx, w, endpoint=False)
    ys = np.linspace(0, gy, h, endpoint=False)
    x0 = np.floor(xs).astype(int); y0 = np.floor(ys).astype(int)
    tx = xs - x0; ty = ys - y0
    sx = tx * tx * (3 - 2 * tx)       # smoothstep
    sy = ty * ty * (3 - 2 * ty)
    x1 = np.minimum(x0 + 1, gx); y1 = np.minimum(y0 + 1, gy)
    a = grid[np.ix_(y0, x0)]; b = grid[np.ix_(y0, x1)]
    c = grid[np.ix_(y1, x0)]; d = grid[np.ix_(y1, x1)]
    top = a + (b - a) * sx[None, :]
    bot = c + (d - c) * sx[None, :]
    return top + (bot - top) * sy[:, None]

def fbm(w, h, octaves=5, fx=4, fy=2, gain=0.5, lac=2.0):
    out = np.zeros((h, w)); amp = 1.0; norm = 0.0
    for i in range(octaves):
        out += amp * value_noise_cylindrical(w, h, fx * lac**i, fy * lac**i)
        norm += amp; amp *= gain
    return out / norm

def strip(w, h, coverage, softness, seed):
    global RNG
    RNG = np.random.default_rng(seed)
    n = fbm(w, h, octaves=6, fx=3, fy=2)
    # vertical window: cloud mass sits low-centre and feathers to nothing
    y = np.linspace(0, 1, h)[:, None]
    window = np.exp(-((y - 0.55) ** 2) / (2 * 0.20 ** 2))
    a = n * window
    # threshold into cloud vs sky, then soften the edge
    a = (a - (1.0 - coverage)) / softness
    a = np.clip(a, 0, 1)
    a = a ** 1.35                      # thin the wispy edges
    return (a * 255).astype(np.uint8)

for name, (w, h, cov, soft, seed) in {
    "cloud-back":  (1600, 320, 0.62, 0.34, 11),
    "cloud-mid":   (1600, 420, 0.66, 0.30, 23),
    "cloud-front": (1600, 560, 0.70, 0.26, 37),
}.items():
    alpha = strip(w, h, cov, soft, seed)
    rgb = np.full((h, w, 3), 255, np.uint8)          # pure white cloud
    img = Image.fromarray(np.dstack([rgb, alpha]), "RGBA")
    img.save(f"{name}.png")
    print(f"{name}.png  {w}x{h}  mean alpha {alpha.mean():.1f}")

# proof of seamlessness: the wrap column must match the first column
a = np.array(Image.open("cloud-mid.png"))[:, :, 3]
print("seam delta (should be ~0):", float(np.abs(a[:, 0].astype(int) - a[:, -1].astype(int)).mean()))
