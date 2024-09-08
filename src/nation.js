const nation_div = document.getElementById("nation")
const search_box = document.getElementById("search")
const search_results = document.getElementById("search_results")
const unselect = document.getElementById("unselect")
lands = {}
tiers = {}

fetch("lands.json").then(async (res) => {
	const data = await res.json()

	lands = data
})

// fetch("pub_tiers.json").then(async (res) => {
// 	const data = await res.json()

// 	tiers = data
// })

function search(string) {
	const names_map = {}

	for (const [_, land_data] of Object.entries(lands)) {
		if (land_data.name.toLowerCase().includes(string.toLowerCase())) {
			names_map[land_data.name] = true
			continue
		}

		if (land_data.residents) {
			if (
				land_data.residents
					.map((name) => name.toLowerCase())
					.some((name) => name.includes(string.toLowerCase()))
			) {
				names_map[land_data.name] = true
			}
		}
	}

	const generated = Object.keys(names_map)
		.map((name) => {
			const nation_data = lands[name]

			return `<li><a class="search_result" href="#">${name}</a></li>`
		})
		.join("")

	search_results.innerHTML = generated
}

function getNationFromName(nation_name) {
	for (const [id, data] of Object.entries(lands)) {
		if (data.name == nation_name && data.chunks.length > 0) {
			return id
		}
	}
}

function setSelectedNation(id) {
	const nation = lands[id]

	if (!nation) {
		nation_div.style.display = "none"
		return
	}
	nation_div.style.display = "block"

	rows = ""

	if (nation.residents) {
		let f = "Owner"
		nation.residents.forEach((player) => {
			let tier = "unknown"

			if (player in tiers) {
				tier = tiers[player]
			}

			rows += `<tr>
                <td>${player}</td>
                <td>${f}</td>
                <td>${tier}</td>
                </tr>
            </tr>`
			f = "unknown"
		})
	}

	nation_div.children.item(0).innerHTML = nation.name

	nation_div.children.item(3).innerHTML = `Name: ${nation.name}
    <br>Players: ${(nation.residents || []).length}
    <br>Chunks: ${nation.chunks.length}
    <br>Balance: ${"?????????"}`

	nation_div.children.item(7).innerHTML = `<tr>
        <th>Player</th>
        <th>Rank</th>
        <th>Tiered</th>
    </tr>
    ${rows}`

	nation_div.children.item(9).name = id
}

function trigger_search(event) {
	search(search_box.value)
}

addEventListener("click", (e) => {
	if (e.target.className == "search_result") {
		setSelectedNation(getNationFromName(e.target.innerHTML))
	}
})
unselect.onclick = () => setSelectedNation(undefined)
search_box.onchange = trigger_search
search_box.onkeypress = trigger_search
search_box.onpaste = trigger_search
search_box.oninput = trigger_search
