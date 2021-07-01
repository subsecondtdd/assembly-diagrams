ASSEMBLIES = $(wildcard assemblies/*.txt)
SVGS       = $(patsubst assemblies/%.txt,images/svg/%.svg,$(ASSEMBLIES))
PNGS       = $(patsubst images/svg/%.svg,images/png/%.png,$(SVGS))

pngs: $(PNGS)
.PHONY: pngs

.PRECIOUS: images/svg/%.svg

images/svg/%.svg: assemblies/%.txt src/assembly.css
	mkdir -p $(@D)
	./cli.js $< src/assembly.css > $@

images/png/%.png: images/svg/%.svg
	mkdir -p $(@D)
	cairosvg --scale 0.4 $< -o $@

clean:
	rm -rf images
.PHONY: clean
