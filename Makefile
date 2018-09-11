SVGS     = $(wildcard images/svg/*.svg)
PNGS     = $(patsubst images/svg/%.svg,images/png/%.png,$(SVGS))

pngs: $(PNGS)
.PHONY: pngs

images/png/%.png: images/svg/%.svg
	mkdir -p $$(dirname "$@")
	cairosvg --scale 0.4 $< -o $@

clean:
	rm -rf images
.PHONY: clean
