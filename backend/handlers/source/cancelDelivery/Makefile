FUNC_NAME=cancelDelivery
PROJ_ROOT_DIR=../../../
SOURCE_DIR=$(PROJ_ROOT_DIR)/handlers/source/$(FUNC_NAME)
BUILD_DIR=$(PROJ_ROOT_DIR)/handlers/build/$(FUNC_NAME)
PACKAGED_DIR=$(PROJ_ROOT_DIR)/handlers/packaged

build:
	mkdir -p $(BUILD_DIR)
	mkdir -p $(PACKAGED_DIR)
	pip3 install -r ${SOURCE_DIR}/requirements.txt --target=$(BUILD_DIR)
	cp $(SOURCE_DIR)/*.py $(BUILD_DIR)/
	cd $(BUILD_DIR) && zip -rq $(FUNC_NAME).zip *
	cp $(BUILD_DIR)/$(FUNC_NAME).zip $(PACKAGED_DIR)/
