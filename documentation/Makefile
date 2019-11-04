compile: html pdf epub

html:
	Rscript -e "bookdown::render_book('index.Rmd')"
	make move	
pdf:
	Rscript -e "bookdown::render_book('index.Rmd', output_format = 'bookdown::pdf_book')"
epub:
	Rscript -e "bookdown::render_book('index.Rmd', output_format = 'bookdown::epub_book')"

move:
	if [ ! -d ../docs ]; then mkdir ../docs; else rm -rf ../docs/*;fi;
	cp -R _book/* ../docs
