package main

import "fmt"

func main() {
	var jenis string
	var jam int
	var tarif int
	var total int
	var ulang string = "yes"

	for ulang == "yes" || ulang == "YES" {

		fmt.Print("Masukkan jenis kendaraan (motor/mobil): ")
		fmt.Scan(&jenis)

		if jenis == "motor" {
			tarif = 2000
		} else if jenis == "mobil" {
			tarif = 5000
		} else {
			fmt.Println("Jenis kendaraan tidak valid!")
			continue
		}

		fmt.Print("Masukkan lama parkir (jam): ")
		fmt.Scan(&jam)

		if jam < 0 {
			fmt.Println("Jam tidak boleh negatif!")
			continue
		}

		total = tarif * jam

		fmt.Println("----- STRUK PARKIR -----")
		fmt.Println("Jenis Kendaraan :", jenis)
		fmt.Printf("Lama Parkir     : %d jam\n", jam)
		fmt.Printf("Tarif per Jam   : %d\n", tarif)
		fmt.Printf("Total Biaya     : %d\n", total)
		fmt.Println("------------------------")

		fmt.Print("Hitung lagi? (yes/no): ")
		fmt.Scan(&ulang)
	}

	fmt.Println("Selamat Jalan :).")
}
