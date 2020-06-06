# k3-respart-tool

Resource Partitioning tool for K3 devices. This tool is based on Texas Instrument's SysConfig tool. It allows you to configure various system level parameters and generate the data which can be fed into many software components.

Typical usage for this tool is for System integrators, where one would be  able to partition various resources across different software components. These resources includes DMA channels, rings, proxies, interrupts, etc. Apart from this, the tool supports configuration of QoS (Quality of Service) and Firewall parameters which helps in ensuring partitioning of peripherals across different CPUs or virtual machines.

## Getting started

To start using this tool, Download the latest SysConfig tool.
* Download SysConfig tool from [Internal jenkins build](http://tgddsbuild2.toro.design.ti.com:8080/view/SysConfig/job/sysconfig.build.installers/1411/)

  Download the file setup.exe or setup.run for Windows or Linux machine
* Clone the git repo from [bitbucket project](https://bitbucket.itg.ti.com/projects/PSDKLA/repos/k3-resource-partitioning/browse)
* Open the SysConfig tool and select the software product by navigating to the path where the git repo is cloned


## Usage

Once you have loaded the product in the SysConfig, you can accomplish following things.

#### NAVSS Resource partitioning

This module allows to define different hosts that are used in the System. For each host, it is possible to configure the capabilities of the host as required. NAVSS resources are shown in different groups. User can add multiple unique hosts in the module and specify the required count of resource for each. The tool automatically allocates the resources in the available range. It generates the output files **rm-cfg.c** and **sciclient_defaultBoardcfg_rm.c** which can be used as the RM board config files to be passed to System firmware.

#### Review resource allocation

At any point, user can review the current resource allocation done by the tool. Select the pane **Resource Allocation** from the three dots shown at the top left corner of the tool. Here, it presents a simple table which shows the exact range of resources allocated for each host. Each column describes the resource ranges assigned for a certain host. Each row describes how a resource has been assigned to multiple hosts

#### QoS configuration

This module allows to generate the data required for configuring CBASS QoS (Quality of Service) endpoints. QoS configuration includes two types of parameters. Few parameters are used for tuning the performance of the DMA transactions in the interconnect, and others are used for setting up the IOMMU paths for the masters. For each device, there are multiple master ports using which, DMA requests are made. Each device is capable of driving different values of channel_id along with the DMA request. For every channel, a unique QoS configuration can be programmed. User can select a device, choose all the endpoints, and select a channel for which QoS should be programmed. The tool auto generates a simple address-value pair data structure in the **qos-config.c** output file. This can be used by any software (typically bootloader) to configure all the QoS settings.

#### Firewall configuration

Currently, this is work in progress. Stay tuned for more updates.

## Developer notes

### directory structure
* **.metadata/product.json** - This file describes all the modules and templates that needs to be loaded by the SysConfig tool. It also describes the supported platforms.
* **modules** - This contains the UI module definition for different configurables, their grouping and organization
* **templates** - This contains the xdt files which describe the output file formats and small code snippets to generate the data using templates.
* **scripts*** - These are the Javascripts for parsing different input data files which generate the SoC specific JSON objects for the usage in the modules. It also implements few utility functions which are frequently called by modules and templates.
* **data/** - This contains the JSON objects that the tool uses to populate the UI items with SoC specific data. Many of these are auto generated using the parsing scripts.

### Generating parsing data

Use different `scripts/parse*.js` scripts to generate the JSON objects for different modules for individual SoCs. There is a utility script `scripts/update-json-files.sh` to generate all the required JSON objects for all the supported SoCs.