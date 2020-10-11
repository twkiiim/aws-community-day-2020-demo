SUBDIRS := $(wildcard ./handlers/source/*)
# SUBDIRS := $(filter-out ./handlers/source/shared, $(SUBDIRS))

all clean : $(SUBDIRS)

$(SUBDIRS) :
	$(MAKE) -C $@ $(MAKECMDGOALS)

.PHONY: all clean $(SUBDIRS)