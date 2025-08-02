package main

import (
	"database/sql"
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

var db *sql.DB

type Config struct {
	ConnStr string `json:"connStr"`
}

type Food struct {
	Food        string  `json:"food"`
	Origin      string  `json:"origin"`
	Calories    int64   `json:"calories"`
	Protein     float32 `json:"protein"`
	Fiber       float32 `json:"fiber"`
	VitaminC    float32 `json:"vitamin_c"`
	Antioxidant int64   `json:"antioxidant"`
}

func loadConfig(filename string) (*Config, error) {
	file, err := os.Open(filename)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	configBytes, err := ioutil.ReadAll(file)
	if err != nil {
		return nil, err
	}

	var config Config
	err = json.Unmarshal(configBytes, &config)
	if err != nil {
		return nil, err
	}
	return &config, nil
}

func main() {
	config, err := loadConfig("config.json")
	if err != nil {
		log.Fatal("Error loading config:", err)
	}

	db, err = sql.Open("postgres", config.ConnStr)
	if err != nil {
		log.Fatal("Error opening database:", err)
	}
	defer db.Close()

	err = db.Ping()
	if err != nil {
		log.Fatal("Cannot connect to DB:", err)
	}

	router := gin.Default()

	// Enable CORS if frontend served separately or cross-origin requests needed
	router.Use(cors.Default())

	// API endpoints only
	router.GET("/foods", getFoods)
	router.POST("/foods", createFood)
	router.PUT("/foods/:food", updateFood)
	router.DELETE("/foods/:food", deleteFood)

	log.Println("API server starting on :8080")
	err = router.Run(":8080")
	if err != nil {
		log.Fatal("Server run error:", err)
	}
}

func getFoods(c *gin.Context) {
	rows, err := db.Query("SELECT food, origin, calories, protein, fiber, vitamin_c, antioxidant FROM healthy_foods")
	if err != nil {
		log.Println("Database query error:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching data"})
		return
	}
	defer rows.Close()

	var foods []Food
	for rows.Next() {
		var f Food
		err := rows.Scan(&f.Food, &f.Origin, &f.Calories, &f.Protein, &f.Fiber, &f.VitaminC, &f.Antioxidant)
		if err != nil {
			log.Println("Row scan error:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error scanning data"})
			return
		}
		foods = append(foods, f)
	}

	c.JSON(http.StatusOK, foods)
}

func createFood(c *gin.Context) {
	var newFood Food
	if err := c.BindJSON(&newFood); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	_, err := db.Exec(`INSERT INTO healthy_foods(food, origin, calories, protein, fiber, vitamin_c, antioxidant)
		VALUES ($1, $2, $3, $4, $5, $6, $7)`,
		newFood.Food, newFood.Origin, newFood.Calories, newFood.Protein, newFood.Fiber, newFood.VitaminC, newFood.Antioxidant)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to insert food"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Food created"})
}

func updateFood(c *gin.Context) {
	foodName := c.Param("food") // Using food name as identifier for simplicity

	var updFood Food
	if err := c.BindJSON(&updFood); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	res, err := db.Exec(`UPDATE healthy_foods SET origin=$1, calories=$2, protein=$3, fiber=$4, vitamin_c=$5, antioxidant=$6 WHERE food=$7`,
		updFood.Origin, updFood.Calories, updFood.Protein, updFood.Fiber, updFood.VitaminC, updFood.Antioxidant, foodName)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update food"})
		return
	}
	count, _ := res.RowsAffected()
	if count == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Food not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Food updated"})
}

func deleteFood(c *gin.Context) {
	foodName := c.Param("food")

	res, err := db.Exec(`DELETE FROM healthy_foods WHERE food=$1`, foodName)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete food"})
		return
	}
	count, _ := res.RowsAffected()
	if count == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Food not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Food deleted"})
}
