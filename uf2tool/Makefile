all:
	mkdir -p ../built
	$(CC) -g -Wall tool.c ../hidapi/mac/hid.c -I../hidapi/hidapi -I. -framework IOKit -framework CoreFoundation -o ../built/uf2tool
