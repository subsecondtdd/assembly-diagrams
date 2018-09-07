SRC_PNGS         = $(wildcard src/*.png)
CROPPED_PNGS     = $(patsubst src/%.png,images/png/%.png,$(SRC_PNGS))
CROPPED_PGMS     = $(patsubst src/%.png,images/pgm/%.pgm,$(SRC_PNGS))
SVGS             = $(patsubst src/%.png,images/svg/%.svg,$(SRC_PNGS))

cropped_pngs: $(CROPPED_PNGS)
.PHONY: cropped_pngs

cropped_pgms: $(CROPPED_PGMS)
.PHONY: cropped_pgms

svgs: $(SVGS)
.PHONY: svgs

images/png/%.png: src/%.png
	mkdir -p $$(dirname "$@")
	convert "$<" -alpha remove -crop "984x602+884+708" "$@"

images/pgm/%.pgm: src/%.png
	mkdir -p $$(dirname "$@")
	convert "$<" -alpha remove -crop "984x602+884+708" "$@"

images/svg/%.svg: images/pgm/%.pgm
	mkdir -p $$(dirname "$@")
	mkbitmap --filter 32 --threshold 0.4 "$<" -o - | potrace --svg -o "$@"
