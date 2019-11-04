compile: html pdf epub

html:
	Rscript -e "bookdown::render_book('index.Rmd')"

pdf:
	Rscript -e "bookdown::render_book('index.Rmd', output_format = 'bookdown::pdf_book')"
epub:
	Rscript -e "bookdown::render_book('index.Rmd', output_format = 'bookdown::epub_book')"
